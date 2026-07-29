public record RegisterEmployeeRequest(
    string EmployeeNumber, string FirstName, string LastName,
    string IdNumber, string? Position, string? Department,
    string? ContactNumber, string? Email, string? Gender);

public record EmployeeResponse(
    string EmployeeNumber, string FirstName, string LastName,
    string? Department, bool IsActive);

public record FaceVerificationRequest(float[] Vector, double Threshold = 0.85);

public record FaceVerificationResponse(string EmployeeNumber, double Similarity, bool Matched);