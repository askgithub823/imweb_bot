module.exports = function () {
  return (async () => {
    try {
      let data = await postgresSequelize.query(
        `SELECT id AS Id,survey_name AS SurveyName, data, created_by AS CreatedBy,created_date AS CreatedDate FROM survey_data`
      )
      return data;
    } catch (e) {
      console.log(e)
    }
  })()
}

