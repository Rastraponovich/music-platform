export const internalRequest = async ({
  url = "",
  method = "GET",
  body = {},
}: {
  url: string;
  method: string;
  body: object;
}) => {
  const headers = new Headers({});

  return await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/${url}`, {
    body: JSON.stringify(body),
    method,
    headers,
  });
};

export const externalRequest = async (
  url: string = "",
  method: string = "GET",
  body: object = {},
) => {
  const headers = new Headers({});

  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/${url}`, {
    ...(method !== "GET" && { body: JSON.stringify(body) }),
    method,
    headers,
  });
};
