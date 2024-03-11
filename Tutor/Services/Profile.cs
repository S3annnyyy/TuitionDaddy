using System;
using Npgsql;
using Tutor.Context;
using Tutor.Models;
using Microsoft.AspNetCore.Mvc;

namespace Tutor.Services
{
    public class ProfileService
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        public ProfileService(IConfiguration configuration, DBContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<IActionResult> Create(TutorProfile profile)
        {
            string query1 = @"
                INSERT into tutorProfile(tutorid, description, experience, subjectLevel)
                values(@tutorid, @description, @experience, @subjectLevel)";
            string query2 = @"
                INSERT into tutorPrice(tutorid, subjectLevel, Price)
                values(@tutorid, @subjectLevel, @price)";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NgqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command1 = new NpgsqlCommand(query1, conn);
                    command1.Parameters.AddWithValue("@tutorid", profile.TutorId);
                    command1.Parameters.AddWithValue("@description", profile.description);
                    command1.Parameters.AddWithValue("@experience", profile.experience);
                    command1.Parameters.AddWithValue("@subjectLevel", profile.subjectLevel.Keys.ToList());
                    await command1.ExecuteReaderAsync();

                    NpgsqlCommand command2 = new NpgsqlCommand(query2, conn);
                    command2.Parameters.AddWithValue("@tutorid", profile.TutorId);
                    command2.Parameters.AddWithValue("@subjectLevel", profile.subjectLevel.Keys.ToList());
                    command2.Parameters.AddWithValue("@price", profile.subjectLevel.Values.ToList());
                    await command2.ExecuteReaderAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            };
        }
        public async Task<IActionResult> Update(TutorProfile profile)
        {
            string query = @"
                UPDATE tutorProfile
                SET
                    description = @description
                    experience = @experience
                    subjectLevel = @subjectLevel
                WHERE tutorid = @tutorid";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NgqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    command.Parameters.AddWithValue("@tutorid", profile.TutorId);
                    command.Parameters.AddWithValue("@description", profile.Description);
                    command.Parameters.AddWithValue("@experience", profile.Experience);
                    command.Parameters.AddWithValue("@subjectLevel", profile.subjectLevel.Keys.ToList());
                    await command.ExecuteReaderAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            }
        }
        public async Task<IActionResult> GetById(int tutorId)
        {
            string query = @"
                SELECT * 
                FROM tutorProfile
                WHERE tutorid = @tutorid";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NgqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    command.Parameters.AddWithValue("@tutorid", tutorId);
                    await command.ExecuteReaderAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            }
        }
        public async Task<IActionResult> GetAll()
        {
            string query = @"
                SELECT * 
                FROM tutorProfile";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NgqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    await command.ExecuteReaderAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            }
        }

    }
}