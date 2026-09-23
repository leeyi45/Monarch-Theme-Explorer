export function unflattenObject(entries: [string, any][]): Record<string, any> {
  function writePath(obj: Record<string, any>, path: string[], value: any) {
    if (path.length === 0) return;

    const [arg, ...rest] = path;

    if (rest.length === 0) {
      obj[arg] = {
        '': value
      };
      return;
    }

    if (!(arg in obj)) {
      obj[arg] = {};
    }

    writePath(obj[arg], rest, value);
  }

  const output: Record<string, any> = {};
  entries.forEach(([key, value]) => {
    writePath(output, key.split('.'), value);
  });

  return output;
}
