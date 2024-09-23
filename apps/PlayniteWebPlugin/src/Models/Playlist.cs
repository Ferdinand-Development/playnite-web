using Playnite.SDK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace PlayniteWeb.Models
{
  internal class Playlist : IIdentifiable
  {
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public IEnumerable<Game> Games { get; set; }

    public Playlist(string name, IEnumerable<Game> games)
    {
      Name = name;
      Games = games;

      using (var md5 = MD5.Create())
      {
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(name));
        Id = new Guid(hash);
      }
    }
  }
}
