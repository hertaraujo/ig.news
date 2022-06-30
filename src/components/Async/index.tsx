import { useEffect, useState } from "react";

function Async() {
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);
  // const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // setIsButtonVisible(true);
      setIsButtonInvisible(true);
    }, 1000 * 3);
  }, []);

  return (
    <div>
      <div>Hello World</div>
      {/* {isButtonVisible && <button>Button</button>} */}
      {!isButtonInvisible && <button>Button</button>}
    </div>
  );
}

export default Async;
