using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

public record EmployeeListItem(string EmployeeNumber, string FirstName, string LastName,
    string? ContactNumber, string? Email, bool IsActive, string PortalRole);

public record UpdateEmployeeRequest(string FirstName, string LastName, string? Position,
    string? Department, string? ContactNumber, string? Email, string? Gender);

[ApiController]
[Route("api/employees")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmployeesController(AppDbContext db) => _db = db;

    [Authorize(Roles = "Superadmin")]

    [HttpPost("register")]

    
    public async Task<IActionResult> Register(RegisterEmployeeRequest req)
    {
        if (await _db.Employees.AnyAsync(e => e.EmployeeNumber == req.EmployeeNumber))
            return Conflict("Employee number already exists.");

        var employee = new Employee
        {
            EmployeeNumber = req.EmployeeNumber,
            FirstName = req.FirstName,
            LastName = req.LastName,
            IdNumber = req.IdNumber,
            Position = req.Position,
            Department = req.Department,
            ContactNumber = req.ContactNumber,
            Email = req.Email,
            Gender = req.Gender,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();

        return Ok(new EmployeeResponse(employee.EmployeeNumber, employee.FirstName,
            employee.LastName, employee.Department, employee.IsActive));
    }

    [HttpGet("{empNo}")]
    public async Task<IActionResult> Get(string empNo)
    {
        var e = await _db.Employees.FindAsync(empNo);
        if (e == null) return NotFound();
        return Ok(new EmployeeResponse(e.EmployeeNumber, e.FirstName, e.LastName, e.Department, e.IsActive));
    }

    [Authorize(Roles = "Superadmin")]
    [HttpPost("{empNo}/face-vector")]
    public async Task<IActionResult> SetFaceVector(string empNo, [FromBody] float[] vector)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound();

        employee.FaceVector = new Pgvector.Vector(vector);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // Admin Dashboard employee list — Name, Surname, Phone, Email, and the
    // Role (HR/Employee/Pending) column.
    [Authorize(Roles = "Superadmin,HR")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var employees = await _db.Employees.ToListAsync();
        var admins = await _db.Admins.ToListAsync();

        var result = employees.Select(e =>
        {
            var adminRow = admins.FirstOrDefault(a => a.EmployeeNumber == e.EmployeeNumber);
            var portalRole = adminRow == null
                ? "Employee"
                : (adminRow.IsActivated ? adminRow.Role : "Pending");

            return new EmployeeListItem(e.EmployeeNumber, e.FirstName, e.LastName,
                e.ContactNumber, e.Email, e.IsActive, portalRole);
        }).ToList();

        return Ok(result);
    }

    // Update employee details (Admin Dashboard "Update" action). Face vector
    // is deliberately excluded — re-enrollment stays on its own endpoint above.
    [Authorize(Roles = "Superadmin")]
    [HttpPut("{empNo}")]
    public async Task<IActionResult> Update(string empNo, UpdateEmployeeRequest req)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound();

        employee.FirstName = req.FirstName;
        employee.LastName = req.LastName;
        employee.Position = req.Position;
        employee.Department = req.Department;
        employee.ContactNumber = req.ContactNumber;
        employee.Email = req.Email;
        employee.Gender = req.Gender;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Employee updated." });
    }

    // Delete employee (Admin Dashboard "Delete" action). Also removes any
    // Admin row so a deleted employee can't still log in.
    [Authorize(Roles = "Superadmin")]
    [HttpDelete("{empNo}")]
    public async Task<IActionResult> Delete(string empNo)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound();

        var adminRow = await _db.Admins.FirstOrDefaultAsync(a => a.EmployeeNumber == empNo);
        if (adminRow != null) _db.Admins.Remove(adminRow);

        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Employee deleted." });
    }

    // Grants HR portal access — creates a PENDING Admin row (no password yet).
    // The employee then activates it themselves via POST /api/auth/set-password.
    [Authorize(Roles = "Superadmin")]
    [HttpPost("{empNo}/promote-to-hr")]
    public async Task<IActionResult> PromoteToHr(string empNo)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound("Employee not found.");

        var existing = await _db.Admins.FirstOrDefaultAsync(a => a.EmployeeNumber == empNo);
        if (existing != null)
            return BadRequest("This employee already has a portal account (pending or active).");

        _db.Admins.Add(new Admin
        {
            EmployeeNumber = empNo,
            FullName = $"{employee.FirstName} {employee.LastName}",
            Role = "HR",
            PasswordHash = string.Empty,
            IsActivated = false,
            CreatedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        return Ok(new { message = "HR invite created. Employee can now activate via set-password." });
    }
}