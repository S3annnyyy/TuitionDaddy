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
        

    }
}