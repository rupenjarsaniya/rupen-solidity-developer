import { useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { useContractWrite } from "wagmi";
import AirdropABI from "./lib/abi/Airdrop.json";
import BEP20 from "./lib/abi/BEP20.json";
import web3 from "web3";
import { toast } from "react-toastify";

function App() {
  const [address, setAddress] = useState(
    "0x5d39b679664829a8fD423A2766844e1adfA690E4"
  );
  const [value, setValue] = useState(0);
  const [airdropType, setAirdropType] = useState("single");
  const [addresses, setAddresses] = useState("");
  const [values, setValues] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalValues = useMemo(() => {
    if (!values) return 0;
    return values.split(",").reduce((acc, cur) => {
      return acc + Number(cur);
    }, 0);
  }, [values]);

  const { writeAsync: approveSingle } = useContractWrite({
    abi: BEP20,
    address: "0xFa60D973F7642B748046464e165A65B7323b0DEE",
    functionName: "approve",
    args: [
      import.meta.env.VITE_AIRDROP_ADDRESS,
      web3.utils.toWei(value, "ether"),
    ],
  });

  const { writeAsync: airdropSingle } = useContractWrite({
    abi: AirdropABI,
    address: import.meta.env.VITE_AIRDROP_ADDRESS,
    functionName: "releaseSingle",
    args: [address, web3.utils.toWei(value, "ether")],
  });

  const { writeAsync: approveMultiple } = useContractWrite({
    abi: BEP20,
    address: "0xFa60D973F7642B748046464e165A65B7323b0DEE",
    functionName: "approve",
  });

  const { writeAsync: airdropMultiple } = useContractWrite({
    abi: AirdropABI,
    address: import.meta.env.VITE_AIRDROP_ADDRESS,
    functionName: "releaseMultiple",
  });

  const handleAirdrop = async () => {
    try {
      setIsLoading(true);
      if (airdropType === "single") {
        await approveSingle();
        await airdropSingle();

        setAddress?.("");
        setValue?.("");
      } else {
        if (!addresses || !values) {
          return alert("Please enter addresses and values");
        }

        await approveMultiple({
          args: [
            import.meta.env.VITE_AIRDROP_ADDRESS,
            web3.utils.toWei(totalValues.toString(), "ether"),
          ],
        });
        await airdropMultiple({
          args: [
            addresses.split(",").map((a) => a.trim()),
            values.split(",").map((v) => web3.utils.toWei(v, "ether")),
          ],
        });

        setAddresses?.("");
        setValues?.("");
      }
      toast.success?.("Airdrop successful");
    } catch (e) {
      toast.error("Somthing went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />

      <form className="flexRow">
        <input
          type="radio"
          id="single"
          name="airdrop"
          value="single"
          onChange={() => setAirdropType("single")}
          defaultChecked
        />
        <label htmlFor="single">Single</label>

        <input
          type="radio"
          id="multiple"
          name="airdrop"
          value="multiple"
          onChange={() => setAirdropType("multiple")}
        />
        <label htmlFor="multiple">Multiple</label>
      </form>
      {isLoading ? (
        <div className="loader" />
      ) : airdropType === "multiple" ? (
        <div className="flexCol">
          <textarea
            placeholder="Enter addresses separated by comma"
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            className="textarea"
          />
          <textarea
            placeholder="Enter values separated by comma"
            value={values}
            onChange={(e) => setValues(e.target.value)}
            className="textarea"
          />
          <button onClick={() => handleAirdrop()}>Airdrop</button>
        </div>
      ) : (
        <div className="flexCol">
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={() => handleAirdrop()}>Airdrop</button>
        </div>
      )}
    </div>
  );
}

export default App;
