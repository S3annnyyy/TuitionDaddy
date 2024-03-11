using Microsoft.EntityFrameworkCore;
using Tutor.Models;

namespace Tutor.Context
{
    public class DBContext : DbContext
    {
        public DbSet<TutorProfile> Tutor_Profile { get; set; }
        public DbSet<TutorPrice> Tutor_Price { get; set; }
        public DbSet<TutorSlot> Tutor_Slot { get; set; }
        public DbSet<TutorFeedback> Tutor_Feedback { get; set; }

    }
}