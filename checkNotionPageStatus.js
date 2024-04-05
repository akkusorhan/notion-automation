const { Client } = require('@notionhq/client');

(async () => {
    const pageId = "https://www.notion.so/Test-Client-3c284f3256ab4f82aa7b1452f6119c78" // 'aa0e7739-f630-47f6-a467-a42ff1c932a0';
    const response = await notion.pages.retrieve({ page_id: pageId });
    console.log(response.properties.Status.status.name);
  })();