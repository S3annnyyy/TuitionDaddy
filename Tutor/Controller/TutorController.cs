using Microsoft.AspNetCore.Mvc;
using Tutor.Models;
using Tutor.Context;
using Npgsql;
using System.Data;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.EntityFrameworkCore;


namespace Tutor.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TutorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        public TutorController(IConfiguration configuration, DBContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost()]
        public async Task<IActionResult> CreateTutorProfile(TutorProfile profile)
        {
            string query = @"
                INSERT into tutorProfile(tutorid, description, experience, subjectLevel, photoLink, name)
                values(@tutorid, @description, @experience, @subjectLevel, @photoLink, @name)";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", profile.TutorId);
                command.Parameters.AddWithValue("@description", profile.Description);
                command.Parameters.AddWithValue("@experience", profile.Experience);
                command.Parameters.AddWithValue("@subjectLevel", profile.SubjectLevel);
                command.Parameters.AddWithValue("@photoLink", profile.PhotoLink);
                command.Parameters.AddWithValue("@name", profile.Name);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok();
                }
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpPut()]
        public async Task<IActionResult> UpdateTutorProfile(TutorProfile profile)
        {
            string query = @"
                UPDATE tutorProfile
                SET
                    name = @name
                    description = @description,
                    experience = @experience,
                    subjectLevel = @subjectLevel,
                    photoLink = @photoLink
                WHERE tutorid = @tutorid";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", profile.TutorId);
                command.Parameters.AddWithValue("@description", profile.Description);
                command.Parameters.AddWithValue("@experience", profile.Experience);
                command.Parameters.AddWithValue("@subjectLevel", profile.SubjectLevel);
                command.Parameters.AddWithValue("@photoLink", profile.PhotoLink);
                command.Parameters.AddWithValue("@name", profile.Name);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok();
                }
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTutorProfiles()
        {
            string query = @"
                SELECT * 
                FROM tutorProfile";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("{TutorId}")]
        public async Task<IActionResult> GetTutorProfileById(int TutorId)
        {
            string query = @"
                SELECT * 
                FROM tutorProfile
                WHERE tutorid = @tutorid";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", TutorId);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("search")]
        public async Task<IActionResult> GetTutorProfilesBySearch(string search)
        {
            string query = @"
                SELECT * 
                FROM tutorProfile
                WHERE description ILIKE '%' || @search || '%'
                OR experience ILIKE '%' || @search || '%'
                OR EXISTS (
                    SELECT *
                    FROM unnest(subjectlevel) as subject
                    WHERE subject ILIKE '%' || @search || '%')";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@search", search);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpPost("price")]
        public async Task<IActionResult> CreateTutorPrices(TutorPrice price)
        {
            string query = @"
                INSERT into tutorPrice(tutorid, subjectLevel, price)
                values(@tutorid, @subjectLevel, @price)";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", price.TutorId);
                command.Parameters.AddWithValue("@subjectLevel", price.SubjectLevel);
                command.Parameters.AddWithValue("@price", price.Price);
                await command.ExecuteNonQueryAsync();
                return Ok();
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("price/{TutorId}")]
        public async Task<IActionResult> GetTutorPricesById(int TutorId)
        {
            string query = @"
                SELECT *
                FROM tutorPrice
                WHERE tutorid = @tutorid";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", TutorId);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpPut("price")]
        public async Task<IActionResult> UpdateTutorPrices(TutorPrice price)
        {
            string query = @"
                UPDATE tutorPrice
                SET price = @price
                WHERE tutorid = @tutorid
                AND subjectLevel = @subjectLevel";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", price.TutorId);
                command.Parameters.AddWithValue("@subjectLevel", price.SubjectLevel);
                command.Parameters.AddWithValue("@price", price.Price);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok();
                }
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpDelete("price")]
        public async Task<IActionResult> DeleteTutorPrices(int TutorId, string SubjectLevel)
        {
            string query = @"
                DELETE 
                FROM tutorPrice
                WHERE tutorid = @tutorid
                AND subjectLevel = @subjectLevel";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", TutorId);
                command.Parameters.AddWithValue("@subjectLevel", SubjectLevel);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok();
                }
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("tutor/slots/{TutorId}")]
        public async Task<IActionResult> GetAllTutorSlots(int TutorId)
        {
            string query = @"
                SELECT * 
                FROM tutorSlot
                WHERE tutorId = @tutorId
                ORDER BY startAt";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", TutorId);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("slots/available/{TutorId}")]
        public async Task<IActionResult> GetAllAvailableTutorSlots(int TutorId)
        {
            string query = @"
                SELECT * 
                FROM tutorSlot
                WHERE tutorId = @tutorId
                AND students IS NULL
                ORDER BY startAt";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@tutorid", TutorId);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpGet("slots/{SlotId}")]
        public async Task<IActionResult> GetTutorSlotBySlotId(Guid SlotId)
        {
            string query = @"
                SELECT * 
                FROM tutorSlot
                WHERE slotId = @slotId";
            DataTable table = new();
            string connectionString = _configuration.GetConnectionString("Default");
            NpgsqlDataReader myReader;
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@slotId", SlotId);
                myReader = await command.ExecuteReaderAsync();
                table.Load(myReader);
                myReader.Close();
                return Ok(table);
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpPost("slots")]
        public async Task<IActionResult> CreateTutorSlot(TutorSlot slot)
        {
            string query = @"
                INSERT into tutorSlot(slotid, tutorid, students, startAt, duration)
                VALUES (@slotid, @tutorid, @students, @startAt, @duration)";

            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@slotid", slot.SlotId);
                command.Parameters.AddWithValue("@tutorid", slot.TutorId);
                command.Parameters.AddWithValue("@students", slot.Students);
                command.Parameters.AddWithValue("@startat", slot.StartAt);
                command.Parameters.AddWithValue("@duration", slot.Duration);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                return Ok();
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpPut("slots/{SlotId}")]
        public async Task<IActionResult> UpdateTutorSlot(TutorSlot slot)
        {
            string query = @"
                UPDATE tutorSlot
                SET
                    slotid = @slotid,
                    students = @students,
                    startAt = @startAt,
                    duration = @duration
                WHERE tutorid = @tutorid";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@slotid", slot.SlotId);
                command.Parameters.AddWithValue("@tutorid", slot.TutorId);
                command.Parameters.AddWithValue("@students", slot.Students);
                command.Parameters.AddWithValue("@startat", slot.StartAt);
                command.Parameters.AddWithValue("@duration", slot.Duration);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                return Ok();
            }
            finally
            {
                conn.Close();
            }
        }
        [HttpDelete("slots/{SlotId}")]
        public async Task<IActionResult> DeleteTutorSlot(Guid SlotId)
        {
            string query = @"
                DELETE 
                FROM tutorSlot
                WHERE slotid = @slotid";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try
            {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                command.Parameters.AddWithValue("@slotid", SlotId);
                int rowsAffected = await command.ExecuteNonQueryAsync();
                if (rowsAffected == 0)
                {
                    return NotFound();
                }
                else
                {
                    return Ok();
                }
            }
            finally
            {
                conn.Close();
            }
        }
    }
}