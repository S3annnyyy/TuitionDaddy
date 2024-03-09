using Microsoft.EntityFrameworkCore;

namespace Tutor.Context
{
    public class ApplicationDBContext : DBContext
    {
        public DbSet<Tutor_Profile> Tutor_Profile { get; set; }
        public DbSet<Tutor_Price> Tutor_Price { get; set; }
        public DbSet<Tutor_Slot> Tutor_Slot{ get; set; }
        public DbSet<Tutor_Feedback> Tutor_Feedback { get; set; }

    }
}