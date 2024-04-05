const { Client } = require('@notionhq/client');

const notion = new Client({ auth: "secret_ThO5v3yQrNS7omsq6lbJZAUHFDFIt968pYY4TDVNJ17" }); //process.env.NOTION_API_KEY


(async () => {
    const pageId = "https://www.notion.so/Test-Client-3c284f3256ab4f82aa7b1452f6119c78" // 'aa0e7739-f630-47f6-a467-a42ff1c932a0';
    const response = await notion.pages.retrieve({ page_id: pageId });
    console.log(response.properties.Status.status.name);
  })();