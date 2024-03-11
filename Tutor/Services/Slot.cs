using System;
using Npgsql;
using Tutor.Context;
using Tutor.Models;
using Microsoft.AspNetCore.Mvc;

namespace Tutor.Services
{
    public class SlotService
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        public SlotService(IConfiguration configuration, DBContext context)
        {
            _configuration = configuration;
            _context = context;
        }

    }
}