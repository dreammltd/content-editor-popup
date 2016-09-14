import React from 'react';
import { Route, IndexRoute } from 'react-router';

import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import ContentEditorView from 'views/ContentEditorView/ContentEditorView';

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={ContentEditorView} />
  </Route>
);
