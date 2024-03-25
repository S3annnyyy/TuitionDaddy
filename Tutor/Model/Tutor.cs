using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Tutor.Models
{
    public class TutorProfile
    {
        [Key]
        public int TutorId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Experience { get; set; }
        public required List<string> SubjectLevel { get; set; }
        public required string PhotoLink { get; set; }
    }

    public class TutorPrice
    {
        public int TutorId { get; set; }
        public required string SubjectLevel { get; set; }
        public int Price { get; set; }
    }

    public class TutorSlot
    {
        [Key]
        public Guid SlotId { get; set; }
        public int TutorId { get; set; }
        public int Student { get; set; }
        public DateTime StartAt { get; set; }
        public int Duration { get; set; }
    }

}