using Microsoft.AspNetCore.Mvc;
using System.Web.Mvc.Controller;

namespace Tutor.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TutorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        private readonly IProfileService _profileService;
        private readonly ISlotService _slotService;
        private readonly IFeedbackService _feedbackService;


        public TutorController(IConfiguration configuration, DBContext context, ProfileService profileService, SlotService slotService, FeedbackService feedbackService)
        {
            _configuration = configuration;
            _context = context;
            _profileService = profileService;
            _slotService = slotService;
            _feedbackService = feedbackService;
        }

        [HttpPost("{TutorId}")]
        public async Task<IActionResult> CreateTutorProfile(Profile profile)
        {
            try
            {
                var result = await _profileService.Create(profile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{TutorId}")]
        public async Task<IActionResult> UpdateTutorProfile(Profile profile)
        {
            try
            {
                var result = await _profileService.Update(profile);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{TutorId}")]
        public async Task<IActionResult> GetTutorProfile(int tutorId)
        {
            try
            {
                var result = await _profileService.GetbyId(tutorId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTutorProfiles()
        {
            try
            {
                var result = await _profileService.GetAll();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{TutorId}/slots")]
        public async Task<IActionResult> GetTutorSlot(int tutorId)
        {
            try
            {
                var result = await _slotService.Get(tutorId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("bookings")]
        public async Task<IActionResult> BookTutorSlot(int tutorId, Slot slot)
        {
            try
            {
                var result = await _slotService.Book(tutorId, slot);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("bookings/{SlotId}")]
        public async Task<IActionResult> UpdateTutorSlot(int slotId, Slot slot)
        {
            try
            {
                var result = await _slotService.Update(slotId, slot);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("bookings/{SlotId}")]
        public async Task<IActionResult> DeleteTutorSlot(int slotId)
        {
            try
            {
                var result = await _slotService.Delete(slotId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("feedbacks/{UserId}")]
        public async Task<IActionResult> GetFeedback(int userId)
        {
            try
            {
                var result = await _feedbackService.Get(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("feedbacks/{UserId}")]
        public async Task<IActionResult> CreateFeedback(int userId, Feedback feedback)
        {
            try
            {
                var result = await _feedbackService.Create(userId, feedback);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}