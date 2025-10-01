using System.ComponentModel;
using Microsoft.SemanticKernel;

namespace Agents.Tools
{
    public class EmailPlugin
    {

        [KernelFunction, Description("Creates a email and adds it to the queue.")]
        public async Task<string> SendEmail([Description("Email HTML formatted text for the body of the email.")]string body)
        {
            // write the email to a sample file on the file system, as we don't want to actually send an email since this is for demos
            var fileName = Path.Combine(Path.GetTempPath(), "email.html");
            await using var writer = new StreamWriter(fileName);
            await writer.WriteAsync(body);

            // return the file name
            return fileName;
        }

        [KernelFunction, Description("Reads a .eml file and returns the contents as a string.")]
        public async Task<string> ReadEmailFile([Description("The local file path to the email file.")] string filePath)
        {
            // read the file and return the contents
            return await File.ReadAllTextAsync(filePath);
        }
    }
}