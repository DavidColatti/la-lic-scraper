const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

const scrapeLA = async (id, count, csvId) => {
  const results = [];

  for (let i = 0; i <= count; i++) {
    try {
      const url = `http://www.lslbc.louisiana.gov/wp-admin/admin-ajax.php?action=api_actions&api_action=company_details&company_id=${id}`;
      const res = await axios.get(url);

      const {
        company_name,
        email_address,
        licenses,
        mailing_zip,
        phone_number,
      } = res.data;

      const data = {
        lic: id,
        lic_type: licenses[0].type || "n/a",
        businessName: company_name || "n/a",
        email: email_address || "n/a",
        phoneNumber: phone_number || "n/a",
        zip: mailing_zip || "n/a",
        url: url,
      };

      console.log(`ID# ${id} : ${data.businessName} : count ${i}`);
      results.push(data);
    } catch (err) {
      console.log(`ID# ${id} did not scrape`);
    }

    id++;
    continue;
  }

  const csv = new ObjectsToCsv(results);

  await csv.toDisk(`./output${csvId}.csv`);
};

scrapeLA(306308, 200, 1);
scrapeLA(306508, 200, 2);
scrapeLA(306708, 200, 3);
