public class ReviewResponse
{
    public int Id { get; set; }

    public string UserName { get; set; }
        = string.Empty;

    public int Rating { get; set; }

    public string Comment { get; set; }
        = string.Empty;

    public DateTime CreatedDate { get; set; }
}