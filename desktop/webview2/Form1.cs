using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2;

namespace samengine_desktop
{
    public partial class Form1 : Form
    {

        public Form1()
        {
            InitializeComponent();

            // Window Styling
            this.Text = "samengine Desktop";
            //this.FormBorderStyle = FormBorderStyle.None;
        }

        // Load the Website
        private async void Form1_Load(object sender, EventArgs e)
        {
            await webView21.EnsureCoreWebView2Async(null);
            webView21.Source = new Uri("https://samengine.vercel.app");

            // Load File
            //string filePath = Path.Combine(Application.StartupPath, "www", "index.html");
            //webView21.Source = new Uri(filePath);
        }
    }
}
