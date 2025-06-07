import { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import {
  MultiSelect,
  Container,
  Title,
  Center,
  Button,
  Flex,
  NumberInput,
  Table,
  Text,
} from "@mantine/core";
import { DateTime } from "luxon";

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [pickdatevalue, setPickdatevalue] = useState(0);
  const [displayMessage, setDisplayMessage] = useState("");
  const [displayResult, setDisplayResult] = useState([]);
  const [excludedates, setExcludedates] = useState([]);

  const daysOfWeek = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const generateDate = () => {
    // Checking if start and end date selected or not
    if (!startDate && !endDate) {
      setDisplayMessage("Select start and end date");
      return;
    }

    // Checking if Week Days are selected or not
    if (selectedDays.length <= 0) {
      setDisplayMessage("Select Week Days");
      return;
    }

    let startdateLuxon = DateTime.fromISO(startDate);
    let enddateLuxon = DateTime.fromISO(endDate);
    let startdateShow = DateTime.fromISO(startDate);

    let excludedatesArray = excludedates.map((date) => {
      return DateTime.fromJSDate(new Date(date)).toFormat("dd/MM/yyyy");
    });
    // All Dates
    let dateArray = [];

    // Picked Dates
    let resultDates = [];

    if (startdateLuxon.toMillis() > enddateLuxon.toMillis()) {
      setDisplayMessage("Start date need to be small");
      return;
    }

    // Storing all dates to array
    while (startdateLuxon.toMillis() <= enddateLuxon.toMillis()) {
      if (
        selectedDays.includes(startdateLuxon.weekdayLong) &&
        !excludedatesArray.includes(startdateLuxon.toFormat("dd/MM/yyyy"))
      ) {
        dateArray.push({
          date: startdateLuxon.toFormat("dd/MM/yyyy"),
          millisecond: startdateLuxon.toMillis(),
        });
      }

      startdateLuxon = startdateLuxon.plus({ days: 1 });
    }

    if (pickdatevalue == "") {
      setDisplayResult(dateArray);

      setDisplayMessage(
        `Here are all ${
          dateArray.length
        } calendar dates possible between ${startdateShow.toFormat(
          "dd/MM/yyyy"
        )} and ${enddateLuxon.toFormat("dd/MM/yyyy")}`
      );

      return;
    }

    // Checking if pickeddatevalue is more then 1 or not
    if (pickdatevalue < 1) {
      setDisplayMessage("Enter how many dates do you want");
      return;
    }

    // Display Message for available dates
    if (dateArray.length >= pickdatevalue) {

      setDisplayMessage(
        `Here are your ${pickdatevalue} calendar dates out of ${
          dateArray.length
        } possible dates between ${startdateShow.toFormat(
          "dd/MM/yyyy"
        )} and ${enddateLuxon.toFormat("dd/MM/yyyy")}`
      );

    } else {
      
      setDisplayMessage(
        `Only ${
          dateArray.length
        } calendar dates are possible between ${startdateShow.toFormat(
          "dd/MM/yyyy"
        )} and ${enddateLuxon.toFormat("dd/MM/yyyy")}`
      );
    }

    // Random Date
    for (let i = 0; i < pickdatevalue; i++) {
      if (dateArray.length == 0) {
        break;
      }
      let randdomNumber = Math.floor(Math.random() * dateArray.length);
      resultDates.push(dateArray[randdomNumber]);
      dateArray.splice(randdomNumber, 1);
    }

    //Sorting Dates
    resultDates.sort((a, b) => {
      return a.millisecond - b.millisecond;
    });

    setDisplayResult(resultDates);
  };

  return (
    <>
      <header
        style={{
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          backgroundColor: "#228be6",
          padding: "10px 0",
        }}
      >
        <Container>
          <Center position="apart">
            <Title order={2} style={{ color: "white" }}>
              Date Generator
            </Title>
          </Center>
        </Container>
      </header>
      <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
        <Flex mih={50} gap="md" justify="center" direction="column" wrap="wrap">
          <DatePickerInput
            placeholder="Select start date"
            label="Select start date"
            value={startDate}
            onChange={setStartDate}
          />

          <DatePickerInput
            placeholder="Select end date"
            label="Select end date"
            value={endDate}
            onChange={setEndDate}
          />

          <MultiSelect
            data={daysOfWeek}
            placeholder="Select days"
            label="Select days"
            value={selectedDays}
            onChange={setSelectedDays}
          />

          <DatePickerInput
            type="multiple"
            label="Exclude dates"
            placeholder="Exclude date"
            value={excludedates}
            onChange={setExcludedates}
          />

          <NumberInput
            label="Total Dates"
            value={pickdatevalue}
            onChange={setPickdatevalue}
            placeholder="Total Dates"
          />

          <Button onClick={generateDate} style={{ marginTop: 10 }}>
            Generate Dates
          </Button>

          <Text size="lg">{displayMessage}</Text>
        </Flex>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayResult.map((value) => {
              return (
                <Table.Tr key={value?.millisecond}>
                  <Table.Td>{value?.date}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}

export default App;
