import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { debounce } from 'es-toolkit';
import * as monaco from 'monaco-editor';
import { useRef, useState } from 'react';
import Navbar from './Navbar';
import ThemeConfig from './components/ThemeConfig/ThemeConfig';
import Editor from './editor/Editor';
import { sourceAcademyEditorTheme } from './editor/theme';
import { languages, stringifyMonarchGrammar } from './languages';

function useLanguageId() {
  return useState(() => {
    const localStorageItem = localStorage.getItem('langId');

    if (
      localStorageItem === null ||
      !languages.some(({ id }) => id === localStorageItem)
    ) {
      return languages[0].id;
    } else {
      return localStorageItem;
    }
  });
}

export default function App() {
  const [languageId, setLanguageId] = useLanguageId();
  const languageDef = languages.find(({ id }) => id === languageId)!;
  const [monarchError, setMonarchError] = useState<string | null>(null);

  const monarchEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const onMonarchEditorUpdate = debounce((newValue: string) => {
    localStorage.setItem('Monarch Editor', newValue);

    let newGrammar: any;
    try {
      newGrammar = new Function(newValue)();
      setMonarchError(null);
    } catch (error: any) {
      setMonarchError(error.toString());
    }

    if (newGrammar) {
      monaco.languages.setMonarchTokensProvider(languageId, newGrammar);
    }
  }, 200);

  const resetMonarchEditorValue = (newId: string) => {
    const languageDef = languages.find(({ id }) => id === newId)!;
    if (typeof languageDef.monarchGrammar === 'string') return;

    const stringified = 'return ' + stringifyMonarchGrammar(languageDef.monarchGrammar);
    monarchEditorRef.current?.setValue(stringified);
  };

  return <Grid
    container
    columns={6}
    columnSpacing={1}
    sx={{ height: '100vh' }}
  >
    <Grid size={6}>
      <Navbar
        selected={languageId}
        onChange={newValue => {
          setLanguageId(newValue);
          resetMonarchEditorValue(newValue);
        }}
        items={languages.map(({ id, name }) => [id, name])}
      />
    </Grid>
    <Grid size={2}>
      <Stack direction="column" sx={{ height: '100vh' }} spacing={1}>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Typography>Monarch Editor</Typography>
          <Tooltip title="Reset the Monarch Grammar">
            <IconButton onClick={() => resetMonarchEditorValue(languageId)}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Editor
          language='typescript'
          theme='source'
          defaultValue={localStorage.getItem('Monarch Editor') ?? ''}
          onValueChange={onMonarchEditorUpdate}
          ref={monarchEditorRef}
        />
        <Paper>
          <code style={{
            padding: '5px 5px 5px 5px',
            color: monarchError === null ? 'unset' : 'red'
          }}>{monarchError === null ? 'No Error' : monarchError}</code>
        </Paper>
      </Stack>
    </Grid>
    <Grid size={2}>
      <Stack direction="column" sx={{ height: '100vh' }}>
        <Stack direction="row" sx={{ alignItems: 'center '}}>
          <Typography>Code Editor</Typography>
          <Tooltip title="Reset Code Editor">
            <IconButton onClick={() => {
              codeEditorRef.current?.setValue(languageDef.defaultProgram);
            }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Editor
          theme='source'
          language={languageId}
          defaultValue={localStorage.getItem('Code Editor') ?? ''}
          onValueChange={newValue => {
            localStorage.setItem('Code Editor', newValue);
          }}
          ref={codeEditorRef}
        />
      </Stack>
    </Grid>
    <Grid size={2}>
      <ThemeConfig
        themeId='source'
        theme={sourceAcademyEditorTheme}
      />
    </Grid>
  </Grid>;
}
