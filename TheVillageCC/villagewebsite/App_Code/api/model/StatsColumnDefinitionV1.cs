namespace api.model
{
    public class StatsColumnDefinitionV1
    {
        public string headerName { get; private set; }
        public string field { get; private set; }

        public StatsColumnDefinitionV1(string headerName, string field)
        {
            this.headerName = headerName;
            this.field = field;
        }
    }
}
