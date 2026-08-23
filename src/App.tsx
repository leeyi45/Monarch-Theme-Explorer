import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { debounce } from 'es-toolkit';
import * as monaco from 'monaco-editor';
import { useRef, useState } from 'react';
import ThemeConfig from './components/ThemeConfig/ThemeConfig';
import Editor from './editor/Editor';
import { sourceAcademyEditorTheme } from './editor/theme';
import { languages, stringifyMonarchGrammar } from './languages';
import type { ILanguageDefinition } from './languages/types';

export default function App() {
  const [languageDef, setLanguageDef] = useState<ILanguageDefinition>(() => {
    const localStorageItem = localStorage.getItem('langId');

    if (localStorageItem === null) return languages[0];

    const foundLang = languages.find(({ id }) => id === localStorageItem);
    return foundLang ?? languages[0];
  });
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
      monaco.languages.setMonarchTokensProvider(languageDef.id, newGrammar);
    }
  }, 200);

  const resetMonarchEditorValue = (newId: string) => {
    const languageDef = languages.find(({ id }) => id === newId)!;
    if (typeof languageDef.monarchGrammar === 'string') return;

    const stringified = 'return ' + stringifyMonarchGrammar(languageDef.monarchGrammar);
    monarchEditorRef.current?.setValue(stringified);
  };

  const monarchEditor = (
    <Stack direction="column" sx={{ height: '100vh' }} spacing={1}>
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
  );

  const monarchEditorToolbar = (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Typography>Monarch Editor</Typography>
      <Tooltip title="Reset the Monarch Grammar">
        <IconButton onClick={() => resetMonarchEditorValue(languageDef.id)}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const codeEditor = (
    <Editor
      theme='source'
      language={languageDef.id}
      defaultValue={localStorage.getItem('Code Editor') ?? ''}
      onValueChange={newValue => {
        localStorage.setItem('Code Editor', newValue);
      }}
      ref={codeEditorRef}
    />
  );

  const codeEditorToolbar = (
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
  );

  const navbar = (<Toolbar>
    <Stack direction='row' sx={{ width: '100vw' }}>
      <Autocomplete
        options={languages}
        renderInput={props => <TextField {...props} />}
        getOptionLabel={({ name }) => name}
        value={languageDef}
        onChange={(_e, newLang) => {
          if (newLang === null) return;
          setLanguageDef(newLang);
        }}
      />
    </Stack>
  </Toolbar>);

  return <Grid
    container
    columns={12}
    columnSpacing={1}
    sx={{ height: '100vh' }}
  >
    <Grid size={12}>{navbar}</Grid>
    <Grid size={5}>{monarchEditorToolbar}</Grid>
    <Grid size={5}>{codeEditorToolbar}</Grid>
    <Grid size={2} />
    <Grid size={5}>{monarchEditor}</Grid>
    <Grid size={5}>{codeEditor}</Grid>
    <Grid size={2}>
      <ThemeConfig
        themeId='source'
        theme={sourceAcademyEditorTheme}
      />
    </Grid>
  </Grid>;
}
