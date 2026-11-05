import { render, screen } from "@testing-library/react";
import { DataProvider, api, useData } from "./index";

describe("When a data context is created", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("a call is executed on the events.json file", async () => {
    jest.spyOn(api, "loadData").mockResolvedValue({ result: "ok" });

    const Component = () => {
      const { data } = useData();
      return <div>{data?.result}</div>;
    };

    render(
      <DataProvider>
        <Component />
      </DataProvider>
    );

    const dataDisplayed = await screen.findByText("ok");
    expect(dataDisplayed).toBeInTheDocument();
  });

  describe("and the events call failed", () => {
    it("the error is dispatched", async () => {
      window.console.error = jest.fn();

      jest
        .spyOn(api, "loadData")
        .mockRejectedValue("error on calling events");

      const Component = () => {
        const { error } = useData();
        return <div>{error}</div>;
      };

      render(
        <DataProvider>
          <Component />
        </DataProvider>
      );

      const dataDisplayed = await screen.findByText(
        "error on calling events"
      );

      expect(dataDisplayed).toBeInTheDocument();
    });
  });

  it("api.loadData retourne les données de events.json", async () => {
    const mockedData = {
      events: [
        {
          id: 1,
          title: "Test event",
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockedData),
    });

    const result = await api.loadData();

    expect(global.fetch).toHaveBeenCalledWith("/events.json");
    expect(result).toEqual(mockedData);
  });
});