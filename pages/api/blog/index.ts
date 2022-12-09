// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import fs from "fs";
import { EmptyBlog, Blog } from '../../../models/blog';
import { MockAuthenticator, MockServer } from '../../../services/mockData';
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  const authUser = MockAuthenticator.Instance.getAuthUser(req);
  const hasAdminRole = MockAuthenticator.Instance.hasAdminRole(authUser);
  const hasSubscriberRole =
    MockAuthenticator.Instance.hasSubscriberRole(authUser);



  switch (req.method) {
    case 'POST':
      if (!hasAdminRole) {
        res.status(403).json({
          message: 'you do not have permission to access this / POST',
        });
      }
      break;
    case 'GET':
      if (!hasSubscriberRole && !hasAdminRole) {
        res
          .status(403)
          .json({ message: 'you do not have permission to access this / GET' });
      }
      break;
    default:
      res
        .status(403)
        .json({ message: 'you do not have permission to access this / ' });
      break;
  }

  if (req.method === 'POST' && hasAdminRole) {
    const form = new formidable.IncomingForm(
      { uploadDir: process.env.NEXT_PUBLIC_FILE_UPLOAD_DIRECTORY, keepExtensions: true }
    );
    form.parse(req, async function (err, fields, files) {
      createBlog(fields);
    });

    const saveFile = async (file: any) => {
      const data = fs.readFileSync(file.filepath);
      const url = `${file.newFilename}`;
      fs.writeFileSync(url, data);
      await fs.unlinkSync(url);
      return url;
    };

    const createBlog = (value: any, path?: string) => {
      const data = MockServer.BlogData.getBlogs();
      const filePath = '/api/image/' + path;

      const item: Blog = {
        ...EmptyBlog,
        ...value,
        ITCC_BlogID: data.length + 1,
        FilePath: filePath,
        PublishUrl: process.env.NEXT_PUBLIC_REACT_APP_WEBSITE_URL_API + '/image/' + path
      };

      const findItem = MockServer.BlogData.getBlog(item);
      if (!findItem) {
        data.push(item);
        MockServer.BlogData.saveBlogs(data);
      }

      res.status(200).json(MockServer.BlogData.getBlogs());
    }


  } else if (req.method === 'GET' && (hasAdminRole || hasSubscriberRole)) {
    const data = MockServer.BlogData.getBlogs();
    res.status(200).json(data);
  }
}