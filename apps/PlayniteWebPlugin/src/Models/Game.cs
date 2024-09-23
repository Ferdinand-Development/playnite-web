using Playnite.SDK.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace PlayniteWeb.Models
{
  internal class Game : IIdentifiable
  {
    private readonly IEnumerable<Release> releases;
    private readonly PlatformSorter platformSorter;
    private readonly List<string> pcSourceNames;
    private readonly List<string> pcPlatformNames;
    private readonly List<string> xboxPlatformNames;
    private readonly List<string> nintendoPlatformNames;

    public Guid Id => releases.Any() ? new Guid(releases.Select(release => release.Id.ToByteArray()).Aggregate((bytes1, bytes2) =>
    {
      byte[] combinedBytes = new byte[16];

      for (int i = 0; i < 16; i++)
      {
        combinedBytes[i] = (byte)(bytes1[i] ^ bytes2[i]);
      }
      return combinedBytes;
    })): Guid.Empty;
    public IEnumerable<Release> Releases => releases;
    public string Name => releases.First().Name;
    public string Description => releases.First().Description;
    public string Cover => releases.First().CoverImage;

    public Game(IEnumerable<Playnite.SDK.Models.Game> playniteGames)
    {
      platformSorter = new PlatformSorter();
      pcSourceNames = new List<string> { "Steam", "EA app", "Ubisoft Connect", "Epic", "GOG", "Origin", "UPlay", "Battle.net" };
      pcPlatformNames = new List<string> { ".*PC.*", ".*Macintosh.*", ".*Linux.*" };
      xboxPlatformNames = new List<string> { ".*Xbox.*" };
      nintendoPlatformNames = new List<string> { ".*Nintendo.*", ".*Switch.*", ".*Wii.*", ".*Game ?Cube.*" };

      releases = playniteGames.GroupBy(game => game.Source).SelectMany(GetReleases).ToList();
    }

    private IEnumerable<Release> GetReleases(IGrouping<GameSource, Playnite.SDK.Models.Game> groupedBySource)
    {
      for (int i = 0; i < groupedBySource.Count(); i++)
      {
        Platform platform = null;
        try
        {
          platform = groupedBySource.ElementAt(i).Platforms.Where(p => IsMatchingPlatform(groupedBySource.Key, p)).OrderBy(p => p, platformSorter).First();
        }
        catch { }
        if (platform == null)
        {
          continue;
        }

        yield return new Release(groupedBySource.ElementAt(i), platform);
      }
    }

    private bool IsMatchingPlatform(GameSource source, Platform platform)
    {
      if (Regex.IsMatch(source.Name, "playstation", RegexOptions.IgnoreCase))
      {
        return Regex.IsMatch(platform.Name, @".*PlayStation.*", RegexOptions.IgnoreCase);
      }


      if (pcSourceNames.Any(platformName => platformName.ToLower() == source.Name.ToLower()))
      {
        return pcPlatformNames.Any(platformName => Regex.IsMatch(platform.Name, platformName, RegexOptions.IgnoreCase));
      }


      if (Regex.IsMatch(source.Name, "xbox", RegexOptions.IgnoreCase))
      {
        return xboxPlatformNames.Any(platformName => Regex.IsMatch(platform.Name, platformName, RegexOptions.IgnoreCase));
      }


      if (Regex.IsMatch(source.Name, "nintendo", RegexOptions.IgnoreCase))
      {
        return nintendoPlatformNames.Any(platformName => Regex.IsMatch(platform.Name, platformName, RegexOptions.IgnoreCase));
      }

      return false;
    }
  }

  internal class PlatformSorter : IComparer<Platform>
  {

    private IList<string> sortOrder = new List<string> { ".*PC.*", ".*Macintosh.*", ".*Linux.*", ".*PlayStation 5.*", ".*PlayStation 4.*", ".*PlayStation 3.*", ".*PlayStation 2.*", "PlayStation", ".*Xbox Series X", ".*Series S", "Xbox One", "Xbox 360", "Xbox", ".*Switch", ".*Wii U", ".*Wii", ".*Game ?Cube.*", "Nintendo 64.*", "Super Nintendo.*", "Nintendo.*", };

    public int Compare(Platform x, Platform y)
    {
      var xIndex = sortOrder.IndexOf(sortOrder.First(platformName => Regex.IsMatch(x.Name, platformName, RegexOptions.IgnoreCase)));
      var yIndex = sortOrder.IndexOf(sortOrder.First(platformName => Regex.IsMatch(y.Name, platformName, RegexOptions.IgnoreCase)));

      return xIndex.CompareTo(yIndex);
    }
  }
}
