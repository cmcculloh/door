// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import readings from "../../lib/readings";

type ReadingsData = {
    readings: {
        title: string;
        date: string;
        contents: string;
        source: string;
    }[];
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ReadingsData>) {
	res.status(200).json(readings);
}
