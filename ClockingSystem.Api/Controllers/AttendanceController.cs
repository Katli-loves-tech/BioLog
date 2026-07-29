using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/attendance")]
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _db;
    public AttendanceController(AppDbContext db) => _db = db;

    [HttpPost("clock-in/{empNo}")]
    public async Task<IActionResult> ClockIn(string empNo)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null || !employee.IsActive) return NotFound("Employee not found or inactive.");

        var log = new AttendanceLog { EmployeeNumber = empNo, Timestamp = DateTime.UtcNow, LogType = "CLOCK_IN" };
        _db.AttendanceLogs.Add(log);
        await _db.SaveChangesAsync();

        return Ok(new ClockEventResponse(empNo, "CLOCK_IN", log.Timestamp));
    }

    [HttpPost("clock-out/{empNo}")]
    public async Task<IActionResult> ClockOut(string empNo)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound("Employee not found.");

        var log = new AttendanceLog { EmployeeNumber = empNo, Timestamp = DateTime.UtcNow, LogType = "CLOCK_OUT" };
        _db.AttendanceLogs.Add(log);
        await _db.SaveChangesAsync();

        return Ok(new ClockEventResponse(empNo, "CLOCK_OUT", log.Timestamp));
    }
    [Authorize(Roles = "HR,Superadmin")]
    [HttpGet("{empNo}")]
    public async Task<IActionResult> History(string empNo)
    {
        var logs = await _db.AttendanceLogs
            .Where(l => l.EmployeeNumber == empNo)
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync();
        return Ok(logs);
    }
    [Authorize(Roles = "HR,Superadmin")]
    [HttpGet("hours-worked/{empNo}")]
    public async Task<IActionResult> HoursWorked(string empNo)
    {
        var logs = await _db.AttendanceLogs
            .Where(l => l.EmployeeNumber == empNo)
            .OrderBy(l => l.Timestamp)
            .ToListAsync();

        var results = new List<HoursWorkedResponse>();
        for (int i = 0; i < logs.Count - 1; i++)
        {
            if (logs[i].LogType == "CLOCK_IN" && logs[i + 1].LogType == "CLOCK_OUT")
            {
                var hours = (logs[i + 1].Timestamp - logs[i].Timestamp).TotalHours;
                results.Add(new HoursWorkedResponse(empNo, logs[i].Timestamp.Date, Math.Round(hours, 2)));
                i++;
            }
        }
        return Ok(results);
    }
}