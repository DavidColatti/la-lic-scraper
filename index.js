const axios = require("axios");
const ObjectsToCsv = require("objects-to-csv");

const scrapeLA = async (licNum, count, csvId) => {
  const results = [];

  for (let i = 0; i <= count; i++) {
    try {
      const urlFirst = `http://www.lslbc.louisiana.gov/wp-admin/admin-ajax.php?api_action=by_license_number&license_number=${licNum}&action=api_actions`;
      const resFirst = await axios.get(urlFirst, {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "x-requested-with": "XMLHttpRequest",
          cookie:
            "_ga=GA1.2.1214123781.1598644036; _gid=GA1.2.96215783.1598889916; _gat=1; PHPSESSID=896e1ef039dfe1c8ebde8be5ef9fe75b",
        },
        referrer:
          "http://www.lslbc.louisiana.gov/contractor-search/search-contractor-license-number/",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
      });

      const { company_name, id } = await resFirst.data.results[0];

      const urlSecond = `http://www.lslbc.louisiana.gov/wp-admin/admin-ajax.php?action=api_actions&api_action=company_details&company_id=${id}`;

      const resSecond = await axios.get(urlSecond);

      const {
        licenses,
        mailing_zip,
        phone_number,
        email_address,
      } = await resSecond.data;

      const data = {
        lic: licNum,
        companyId: id || "N/A",
        zip: mailing_zip || "N/A",
        email: email_address || "N/A",
        phoneNumber: phone_number || "N/A",
        lic_type: licenses[0].type || "N/A",
        businessName: company_name || "N/A",
      };

      console.log(`${licNum} successfully scraped ${data.businessName}`);
      results.push(data);
    } catch (e) {
      console.log(`${licNum} could'nt be found`);
    }

    const csv = new ObjectsToCsv(results);

    csv.toDisk(`./output${csvId}.csv`);

    licNum++;
    continue;
  }
};

scrapeLA(561987, 1000, 1);
