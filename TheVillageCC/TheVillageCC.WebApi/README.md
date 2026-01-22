# TheVillageCC.WebApi

This is a .NET 9 Web API project that replaces the .NET Framework 4.8 TheVillageCC.Web project.

## Dependencies

This project requires the CricketClub packages from a private Azure DevOps feed:
- CricketClubAccounts
- CricketClubDAL  
- CricketClubDomain
- CricketClubMiddle

### NuGet Feed Configuration

The packages are available at:
```
https://grahampontin.pkgs.visualstudio.com/109e362b-62db-4727-9d2a-e2d0e8f55904/_packaging/CricketClubCore/nuget/v3/index.json
```

A `nuget.config` file has been added to the solution root that configures this feed.

### Building the Project

To build this project, you need:
1. Network access to the Azure DevOps feed
2. Appropriate authentication credentials for the feed (if required)
3. .NET 9 SDK installed

The project will automatically use the latest .NET 9 compatible versions of the CricketClub packages available on the feed.

## Migration from .NET Framework

This project ports the HTTP handlers from the original TheVillageCC.Web project to ASP.NET Core controllers:

- HttpHandlerBase → Base controller classes
- EntityHttpHandlerBase → Generic CRUD base controller
- Individual handlers → Individual controllers (Players, Matches, Stats, etc.)

## Testing

A corresponding test project (TheVillageCC.WebApi.Tests) has been created that ports the tests from TheVillageCC.Web.Tests.
