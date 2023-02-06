declare var my: any;

(global as any).my = new (class {
  request(req: any) {
    const { headers, ...rest } = req;
    setTimeout(() => {
      req.success({
        statusCode: 200,
        headers: { server: "mock" },
        data: { ...rest, headers },
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
