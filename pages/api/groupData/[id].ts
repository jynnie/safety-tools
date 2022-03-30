import type { NextApiRequest, NextApiResponse } from "next";

export default async function groupData(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req?.query || {};

  if (!id) {
    res.status(405).end();
  }

  await fetch(
    `https://${process.env.DB_NAME}.firebaseio.com/${id}.json?auth=${process.env.AUTH_TOKEN}`,
  )
    .then(async (response) => {
      const data = await response.json();

      // Return anonymized data to the client, no codenames
      res.status(200).json({
        id: data?.id,
        name: data?.name,
        warnings: data?.warnings,
        responses: Object.values(data?.responses || {}),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(405).end();
    });
}
