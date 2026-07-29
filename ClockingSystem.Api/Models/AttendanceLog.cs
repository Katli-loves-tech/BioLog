public class AttendanceLog
{
    public int Id { get; set; }
    public string EmployeeNumber { get; set; } = null!;
    public DateTime Timestamp { get; set; }
    public string LogType { get; set; } = null!;
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public int GracePeriodMins { get; set; } = 15;
}