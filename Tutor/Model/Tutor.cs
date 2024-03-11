using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tutor.Models
{
    public class TutorProfile
    {
        [Key]
        public int TutorId { get; set; }
        public required string Description { get; set; }
        public required string Experience { get; set; }
        public List<string>? SubjectLevel { get; set; }
    }

    public class TutorPrice
    {
        [Key]
        public int TutorId { get; set; }
        public required string SubjectLevel { get; set; }
        public int Price { get; set; }
    }

    public class TutorSlot
    {
        [Key]
        public Guid SlotId { get; set; }
        public int TutorId { get; set; }
        public List<int>? Students { get; set; }
        public int StreamingID { get; set; }
    }

    public class TutorFeedback
    {
        [Key]
        public int UserId { get; set; }
        public List<string>? Feedback { get; set; }
    }

}