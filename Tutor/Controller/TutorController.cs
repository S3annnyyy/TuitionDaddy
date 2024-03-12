using Microsoft.AspNetCore.Mvc;
using Tutor.Models;
using Tutor.Services;
using Npgsql;
using System.Data;


namespace Tutor.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TutorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        // private readonly ProfileService _profileService;
        // private readonly PriceService _priceService;
        // private readonly SlotService _slotService;
        // private readonly FeedbackService _feedbackService;


        public TutorController(IConfiguration configuration)
        {
            _configuration = configuration;
            // _profileService = profileService;
            // _priceService = priceService;
            // _slotService = slotService;
            // _feedbackService = feedbackService;
        }
        [HttpPost()]
        public async Task<IActionResult> CreateTutorProfile(TutorProfile profile)
        {
            string query = @"
                INSERT into tutorProfile(tutorid, description, experience, subjectLevel)
                values(@tutorid, @description, @experience, @subjectLevel)";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NpgsqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    command.Parameters.AddWithValue("@tutorid", profile.TutorId);
                    command.Parameters.AddWithValue("@description", profile.Description);
                    command.Parameters.AddWithValue("@experience", profile.Experience);
                    command.Parameters.AddWithValue("@subjectLevel", profile.SubjectLevel);
                    await command.ExecuteReaderAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            };
        }
        [HttpPut()]
        public async Task<IActionResult> UpdateTutorProfile(TutorProfile profile)
        {
            string query = @"
                UPDATE tutorProfile
                SET
                    description = @description,
                    experience = @experience,
                    subjectLevel = @subjectLevel
                WHERE tutorid = @tutorid";
            string connectionString = _configuration.GetConnectionString("Default");
            using (var conn = new NpgsqlConnection(connectionString))
            {
                await conn.OpenAsync();
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    command.Parameters.AddWithValue("@tutorid", profile.TutorId);
                    command.Parameters.AddWithValue("@description", profile.Description);
                    command.Parameters.AddWithValue("@experience", profile.Experience);
                    command.Parameters.AddWithValue("@subjectLevel", profile.SubjectLevel);
                    await command.ExecuteNonQueryAsync();
                    return Ok();
                }
                finally
                {
                    conn.Close();
                }
            };
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTutorProfiles()
        {
            string query = @"
                SELECT * 
                FROM tutorProfile";
            string connectionString = _configuration.GetConnectionString("Default");
            using var conn = new NpgsqlConnection(connectionString);
            await conn.OpenAsync();
            try {
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                NpgsqlDataReader reader = await command.ExecuteReaderAsync();
                List<TutorProfile> tutorProfiles = [];
                while (await reader.ReadAsync())
                {
                    TutorProfile tutorProfile = new TutorProfile
                    {
                        TutorId = reader.GetInt32(reader.GetOrdinal("tutorid")),
                        Description = reader.GetString(reader.GetOrdinal("description")),
                        Experience = reader.GetString(reader.GetOrdinal("experience")),
                        SubjectLevel = GetSubjectLevelList(reader, "subjectlevel"),
                    };
                    tutorProfiles.Add(tutorProfile);
                };
                return Ok(tutorProfiles);
            }
            finally
            {
                conn.Close();
            }
        }

        private List<string> GetSubjectLevelList(NpgsqlDataReader reader, string v)
        {
            List<string> subjectLevels = [];

            if (!reader.IsDBNull(reader.GetOrdinal(v)))
            {
                string subjectLevelsString = reader.GetString(reader.GetOrdinal(v));
                subjectLevels = [.. subjectLevelsString.Split(',')];
            }

            return subjectLevels;
        }
    
    }
}