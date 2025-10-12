using System;
using System.Collections.Generic;

namespace CMA.Web.Models
{
    public class Student
    {
    public string? Id { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public DateTime EnrollmentDate { get; set; }
    public string? Status { get; set; }
    }

    public class Exam
    {
    public string? Id { get; set; }
    public string? UnitId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public int TotalMarks { get; set; }
    public string? Status { get; set; }
    }

    public class Question
    {
    public string? Id { get; set; }
    public string? SectionId { get; set; }
    public string? QuestionText { get; set; }
    public string? Type { get; set; }
    public List<string>? Options { get; set; }
    public List<int>? CorrectAnswers { get; set; }
    public string? Difficulty { get; set; }
    }

    public class ExamAttempt
    {
    public string? Id { get; set; }
    public string? StudentId { get; set; }
    public string? StudentName { get; set; }
    public string? ExamId { get; set; }
    public string? ExamName { get; set; }
        public int Score { get; set; }
        public int TotalMarks { get; set; }
        public int Percentage { get; set; }
    public DateTime AttemptDate { get; set; }
    }

    public class LogEntry
    {
    public DateTime Timestamp { get; set; }
    public string? User { get; set; }
    public string? Action { get; set; }
    public string? Details { get; set; }
    }

    public class SyllabusSection
    {
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    }

    public class SyllabusUnit
    {
    public string? Id { get; set; }
    public string? Title { get; set; }
    public List<SyllabusSection>? Sections { get; set; }
    }
    
    public class Achievement
    {
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
        public bool Unlocked { get; set; }
    }

    public class LeaderboardEntry
    {
    public int Rank { get; set; }
    public string? StudentName { get; set; }
    public int XP { get; set; }
    }
}
