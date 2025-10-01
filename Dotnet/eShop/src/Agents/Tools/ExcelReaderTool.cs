using System.ComponentModel;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.SemanticKernel;

namespace Agents.Tools
{
    public class ExcelReaderTool
    {
        [KernelFunction, Description("Loads a specified Excel file and ouputs the data to CSV")]
        public string ConvertExcelToCsv(string filePath)
        {
            if (string.IsNullOrWhiteSpace(filePath) || !File.Exists(filePath))
            {
                throw new FileNotFoundException("The specified Excel file was not found.", filePath);
            }

            var csvBuilder = new StringBuilder();

            using (var document = SpreadsheetDocument.Open(filePath, false))
            {
                var workbookPart = document.WorkbookPart;
                var sheet = workbookPart.Workbook.Sheets.GetFirstChild<Sheet>();
                if (sheet == null)
                {
                    throw new InvalidOperationException("The Excel file does not contain any sheets.");
                }

                var worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);
                var rows = worksheetPart.Worksheet.GetFirstChild<SheetData>().Elements<Row>();

                foreach (var row in rows)
                {
                    var rowValues = new List<string>();
                    foreach (var cell in row.Elements<Cell>())
                    {
                        rowValues.Add(GetCellValue(workbookPart, cell));
                    }
                    csvBuilder.AppendLine(string.Join(",", rowValues));
                }
            }

            return csvBuilder.ToString();
        }

        private string GetCellValue(WorkbookPart workbookPart, Cell cell)
        {
            if (cell == null || cell.CellValue == null)
            {
                return string.Empty;
            }

            var value = cell.CellValue.Text;

            // Handle shared strings
            if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
            {
                var sharedStringTable = workbookPart.SharedStringTablePart.SharedStringTable;
                return sharedStringTable.ElementAt(int.Parse(value)).InnerText;
            }

            return value;
        }
    }
}
