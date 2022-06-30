import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next/router");
jest.mock("next-auth/react", () => {
  return {
    useSession: () => ({ data: null, status: "unauthenticated" }),
  };
});
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ amount: "R$ 9,99", priceId: "fake-price-id" }} />);

    expect(screen.getByText(/R\$ 9,99/i)).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const stripePricesRetrieveMocked = mocked(stripe.prices.retrieve);

    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
