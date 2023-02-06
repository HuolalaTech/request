declare var swan: any;

(global as any).swan = new (class {
  request(req: any) {
    const { header, ...rest } = req;
    setTimeout(() => {
      req.success({
        statusCode: 200,
        header: { server: "mock" },
        data: { ...rest, headers: header },
      });
    });
  }
  uploadFile(req: any) {
    const { header, name, filePath, formData, ...rest } = req;
    setTimeout(() => {
      req.success({
        statusCode: 200,
        header: { server: "mock" },
        data: {
          ...rest,
          data: formData,
          headers: header,
          files: { [name]: filePath },
        },
      });
    });
  }
})() as any;
