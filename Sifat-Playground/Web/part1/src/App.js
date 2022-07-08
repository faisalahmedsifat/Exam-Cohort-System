const App = () => {
  const now = new Date();
  const a = 10;
  const b = 15;

  return (
    <div>
      <p>Hello World</p>
      <Hello name="Sifat"/>
      <Hello age="34"/>
      <p>Todays date is {now.toString()}</p>
      <p>The total value is {a + b}</p>
    </div>
  );
};

const Hello = (args) => {
  return (
    <div>
      <p>Hello {args.name}</p>
    </div>
  );
};

const exports = {
  App,
  Hello,
};
export default exports;
