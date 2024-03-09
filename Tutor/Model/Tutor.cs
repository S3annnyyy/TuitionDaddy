using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tutor.Models
{
    public class Profile
    {
        [Key]
        public Guid TutorId { get; set; }
        public string Description { get; set; }
        public string Experience { get; set; }
        public List<string> SubjectLevel { get; set; }
    }

    public class Price
    {
        [Key]
        public Guid TutorId { get; set; }
        public string SubjectLevel { get; set; }
        public int Price { get; set; }
    }

    public class Slot
    {
        [Key]
        public Guid SlotId { get; set; }
        public Guid TutorId { get; set; }
        public List<int> Students { get; set; }
        public int StreamingID { get; set; }
    }

    public class Feedback
    {
        [Key]
        public Guid UserId { get; set; }
        public List<string> Feedback { get; set; }
    }

}