#r "nuget: DotNetEnv, 3.2.0"
using System;
using DotNetEnv;

Env.Load();
Console.WriteLine("CloudName with colon: " + Environment.GetEnvironmentVariable("CloudinarySettings:CloudName"));
Console.WriteLine("CloudName with underscore: " + Environment.GetEnvironmentVariable("CloudinarySettings__CloudName"));
