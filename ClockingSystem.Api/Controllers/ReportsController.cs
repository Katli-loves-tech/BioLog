using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public record EmployeeDailyStatus(string EmployeeNumber, string FullName,
    DateTime? ClockInTime, DateTime? ClockOutTime, string Status, string? Duration);

public record HrDashboardSummary(int TotalEmployees, int PresentCount, int LateCount,
    int AbsentCount, List<EmployeeDailyStatus> Employees);

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "HR,Superadmin")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    [HttpGet("organisation")]
    public async Task<IActionResult> OrganisationReport()
    {
        var report = await _db.Employees
            .GroupBy(e => e.Department)
            .Select(g => new { Department = g.Key, EmployeeCount = g.Count() })
            .ToListAsync();
        return Ok(report);
    }

    // HR Dashboard summary — total/present/late/absent counts plus per-employee
    // clock in/out, status, and duration for a given day. Defaults to today.
    [HttpGet("hr-summary")]
    public async Task<IActionResult> GetHrSummary([FromQuery] DateOnly? date)
    {
        var targetDate = date ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var dayStart = DateTime.SpecifyKind(targetDate.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
        var dayEnd = dayStart.AddDays(1);

        var employees = await _db.Employees.Where(e => e.IsActive).ToListAsync();

        var logs = await _db.AttendanceLogs
            .Where(l => l.Timestamp >= dayStart && l.Timestamp < dayEnd)
            .ToListAsync();

        var statuses = new List<EmployeeDailyStatus>();

        foreach (var e in employees)
        {
            var clockIn = logs
                .Where(l => l.EmployeeNumber == e.EmployeeNumber && l.LogType == "CLOCK_IN")
                .OrderBy(l => l.Timestamp)
                .FirstOrDefault();

            var clockOut = logs
                .Where(l => l.EmployeeNumber == e.EmployeeNumber && l.LogType == "CLOCK_OUT")
                .OrderByDescending(l => l.Timestamp)
                .FirstOrDefault();

            string status;
            string? duration = null;

            if (clockIn == null)
            {
                status = "Absent";
            }
            else
            {
                var isLate = clockIn.StartTime.HasValue &&
                    TimeOnly.FromDateTime(clockIn.Timestamp).ToTimeSpan() >
                    clockIn.StartTime.Value + TimeSpan.FromMinutes(clockIn.GracePeriodMins);

                status = isLate ? "Late" : "Present";

                if (clockOut != null)
                {
                    var span = clockOut.Timestamp - clockIn.Timestamp;
                    duration = $"{(int)span.TotalHours}h {span.Minutes}m";
                }
            }

            statuses.Add(new EmployeeDailyStatus(e.EmployeeNumber, $"{e.FirstName} {e.LastName}",
                clockIn?.Timestamp, clockOut?.Timestamp, status, duration));
        }

        var summary = new HrDashboardSummary(
            TotalEmployees: employees.Count,
            PresentCount: statuses.Count(s => s.Status == "Present"),
            LateCount: statuses.Count(s => s.Status == "Late"),
            AbsentCount: statuses.Count(s => s.Status == "Absent"),
            Employees: statuses);

        return Ok(summary);
    }

    // Per-employee history — powers the "view" action next to each row in the
    // HR list. Defaults to the last 30 days.
    [HttpGet("hr-summary/{empNo}")]
    public async Task<IActionResult> GetEmployeeHistory(string empNo, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to)
    {
        var employee = await _db.Employees.FindAsync(empNo);
        if (employee == null) return NotFound();

        var fromDate = DateTime.SpecifyKind((from ?? DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30))).ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
        var toDate = DateTime.SpecifyKind((to ?? DateOnly.FromDateTime(DateTime.UtcNow)).ToDateTime(TimeOnly.MaxValue), DateTimeKind.Utc);

        var logs = await _db.AttendanceLogs
            .Where(l => l.EmployeeNumber == empNo && l.Timestamp >= fromDate && l.Timestamp <= toDate)
            .OrderBy(l => l.Timestamp)
            .ToListAsync();

        var days = logs
            .GroupBy(l => DateOnly.FromDateTime(l.Timestamp))
            .Select(g =>
            {
                var clockIn = g.Where(l => l.LogType == "CLOCK_IN").OrderBy(l => l.Timestamp).FirstOrDefault();
                var clockOut = g.Where(l => l.LogType == "CLOCK_OUT").OrderByDescending(l => l.Timestamp).FirstOrDefault();

                string? duration = null;
                if (clockIn != null && clockOut != null)
                {
                    var span = clockOut.Timestamp - clockIn.Timestamp;
                    duration = $"{(int)span.TotalHours}h {span.Minutes}m";
                }

                var isLate = clockIn != null && clockIn.StartTime.HasValue &&
                    TimeOnly.FromDateTime(clockIn.Timestamp).ToTimeSpan() >
                    clockIn.StartTime.Value + TimeSpan.FromMinutes(clockIn.GracePeriodMins);

                var status = clockIn == null ? "Absent" : (isLate ? "Late" : "Present");

                return new EmployeeDailyStatus(employee.EmployeeNumber, $"{employee.FirstName} {employee.LastName}",
                    clockIn?.Timestamp, clockOut?.Timestamp, status, duration);
            })
            .ToList();

        return Ok(days);
    }
}