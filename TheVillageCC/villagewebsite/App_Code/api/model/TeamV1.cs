using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for TeamV1
/// </summary>
public class TeamV1
{
    public int Id { get; set; }
    public string Name { get; set; }

    public TeamV1()
    {
    }

    public TeamV1(int id, string name)
    {
        Id = id;
        Name = name;
    }
}