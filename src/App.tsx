import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as monaco from 'monaco-editor';
import { useRef, useState } from 'react';
import { getEditorText, updateMonarchGrammar } from './codeHandlers';
import ThemeConfig from './components/ThemeConfig/ThemeConfig';
import Editor from './editor/Editor';
import { sourceAcademyEditorTheme } from './editor/theme';
import { languages, stringifyMonarchGrammar } from './languages';
import type { ILanguageDefinition } from './languages/types';

function getMonarchEditorDefaultValue(langDef: ILanguageDefinition): string {
  const localStorageItem = localStorage.getItem('Monarch Editor');
  if (localStorageItem !== null) return localStorageItem;

  if (typeof langDef.monarchGrammar === 'string') return '';
  return 'return ' + stringifyMonarchGrammar(langDef.monarchGrammar);
}

export default function App() {
  const [languageDef, setLanguageDef] = useState<ILanguageDefinition>(() => {
    const localStorageItem = localStorage.getItem('langId');
    if (localStorageItem === null) return languages[0];

    const foundLang = languages.find(({ id }) => id === localStorageItem);
    return foundLang ?? languages[0];
  });

  const [monarchError, setMonarchError] = useState<string | number | null>(null);
  const monarchEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const codeEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  /**
   * Actually change the current language definition in use
   */
  function changeLanguageDef(langDef: ILanguageDefinition) {
    setLanguageDef(langDef);

    if (typeof langDef.monarchGrammar === 'string') return;

    const stringified = 'return ' + stringifyMonarchGrammar(langDef.monarchGrammar);
    monarchEditorRef.current?.setValue(stringified);
  }

  const monarchEditor = (
    <Stack direction="column" sx={{ height: '100vh' }} spacing={1}>
      <Editor
        language='typescript'
        theme='source'
        onValueChange={newValue => {
          localStorage.setItem('Monarch Editor', newValue);
          getEditorText(monarchEditorRef.current!)
            .then(result => {
              if (result === undefined) return;
              const [jsText, diag] = result;
              if (diag !== null) {
                setMonarchError(diag);
                return;
              }

              if (jsText !== null) {
                updateMonarchGrammar(jsText, languageDef, setMonarchError);
              }
            });
        }}
        defaultValue={getMonarchEditorDefaultValue(languageDef)}
        ref={monarchEditorRef}
      />
      <Paper>
        <code style={{
          padding: '5px 5px 5px 5px',
          color: monarchError === null ? 'unset' : 'red'
        }}>{monarchError === null ? 'No Error' :
            typeof monarchError === 'number' ? `${monarchError} Error(s)` : monarchError
          }</code>
      </Paper>
    </Stack>
  );

  const monarchEditorToolbar = (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Typography>Monarch Editor</Typography>
      <Tooltip title="Reset the Monarch Grammar">
        <IconButton onClick={() => changeLanguageDef(languageDef)}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save your changes">
        <IconButton>
          <SaveIcon />
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

  const navbar = (
    <Toolbar>
      <Paper sx={{ bgcolor: '#777777' }}>
        <div style={{ padding: '5px 5px 5px 5px' }}>
          <Grid container sx={{ width: '100vw' }}>
            <Grid size={2}>
              <Autocomplete
                fullWidth
                options={languages}
                renderInput={props => <TextField {...props} />}
                getOptionLabel={({ name }) => name}
                value={languageDef}
                size='small'
                onChange={(_e, newLang) => {
                  if (newLang === null) return;
                  changeLanguageDef(newLang);
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Toolbar>
  );

  return <>
    <Grid
      container
      columns={12}
      columnSpacing={1}
      sx={{ height: '100vh' }}
    >
      <Grid size={12}>
        <Typography variant='h4'>
          Monarch Theme Explorer
        </Typography>
      </Grid>
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
    </Grid>
  </>;
}
