using Microsoft.EntityFrameworkCore;
using Tutor.Models;

namespace Tutor.Context
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }
        public DbSet<TutorProfile> Tutor_Profile { get; set; }
        public DbSet<TutorPrice> Tutor_Price { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TutorPrice>().HasNoKey();
        }
        public DbSet<TutorSlot> Tutor_Slot { get; set; }

    }
}