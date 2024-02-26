import { useEffect, useState } from "react";
import { getDateFromString } from "@utils";

export function useLoadData(apiUrl, dataType = "multiple") {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadRecords() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl);
      if (response.status === 404) {
        throw Error('Data not found');
      }
      if (!response.ok) {
        throw Error('Unknown error');
      }
      console.log(response);
      const data = await response.json();
      const result = dataType === 'single' ? [data] : data.result;

      setRecords(
        result.map((record) => ({
          id: record.id,
          date: getDateFromString(record.r_date),
          meal: record.r_meal,
          calories: record.r_cal,
          content: record.r_food,
        }))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [apiUrl]);

  return [dataType === 'single' ? records[0] : records, loading, error, loadRecords];

}