import Form from "./components/Form";

export default async function Characters({ params }: any) {
  return (
    <>
      <main>
        <header>Character {params.id}</header>
        <div>
          <Form id={Number(params.id)} />
        </div>
      </main>
    </>
  );
}
