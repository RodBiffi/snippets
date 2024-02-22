import React, { FC, useEffect, useState } from 'react';
import { H3, ResultList } from '../UI';

const GITHUB_SCHEMA_DIR =
  'https://github.site.io/repo/blob/master/schema/versioned/events/';
const SCHEMA_ROOT = 'http://schema.site.com/events';
const SCHEMA_LATEST_VERSIONS_MANIFEST = 'https://schema.site.com/manifest.json';

type VersionManifest = {
  refs: Record<string, { latestVersion: number }>;
};

export const SchemaSummary: FC<{
  schemaUrl: string;
  validationSuccess: boolean;
}> = ({ schemaUrl, validationSuccess }) => {
  const [latestVersion, setLatestVersion] = useState<number>(-1);
  const [schemaExists, setSchemaExists] = useState(true);
  const [versionsMap, setVersionsMap] = useState<VersionManifest>();
  const eventAndVersionPath = schemaUrl?.split('events/').pop(); // engagement-event.json/187.json
  const eventAndVersion = eventAndVersionPath?.split('.json'); // ["engagement-event", "/187"]
  const name = eventAndVersion?.[0]; // engagement-event
  const version = Number(eventAndVersion?.[1].substring(1)); // 187

  useEffect(() => {
    const checkSchemaVersion = (manifest: VersionManifest) => {
      if (!name) {
        return;
      }
      const schemaInfo = manifest.refs[`events/${name}.json`];
      if (schemaInfo) {
        setLatestVersion(schemaInfo.latestVersion);
      }
      setSchemaExists(Boolean(schemaInfo));
    };
    const updateLatestVersionsAndCheck = async () => {
      const res = await fetch(SCHEMA_LATEST_VERSIONS_MANIFEST);
      if (!res.ok) {
        console.error(
          `${res.status} ${res.statusText}: failed to fetch ${SCHEMA_LATEST_VERSIONS_MANIFEST}`,
        );
        return;
      }
      const manifest = await res.json();
      setVersionsMap(manifest);
      checkSchemaVersion(manifest);
    };

    if (!versionsMap) {
      updateLatestVersionsAndCheck();
    } else {
      checkSchemaVersion(versionsMap);
    }
  }, [schemaUrl, name, version]);

  if (!eventAndVersionPath) {
    return (
      <ResultList>
        <p>
          {`Event schema could not be detected. Your event JSON must contain a "schema"
                    field which points to the JSON schema it should validate against.`}
        </p>
      </ResultList>
    );
  }

  const renderLatestVersion = latestVersion > version && (
    <>
      <li>
        Latest version:&nbsp;
        <a
          href={`${SCHEMA_ROOT}/${name}.json/${latestVersion}.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {latestVersion}
        </a>
        &nbsp;-&nbsp;
        <a
          href={`${GITHUB_SCHEMA_DIR}/${name}.json/${latestVersion}.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </li>
      {!validationSuccess && (
        <>
          <li>A newer version of the schema for this event is available.</li>
          <li>
            The event may pass validation on newer versions, consider updating.
          </li>
        </>
      )}
    </>
  );

  const renderNonExistingSchema = (
    <>
      <li>The current version of the given schema does not exist.</li>
      <li>
        The event may pass validation on another version, consider updating.
      </li>
      <li>
        See the existing versions of this schema on&nbsp;
        <a
          href={`${GITHUB_SCHEMA_DIR}/${name}.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </li>
    </>
  );

  return (
    <ResultList>
      <H3>Schema summary</H3>
      <ul>
        <li>Schema: {name}</li>
        <li>
          Version in event:&nbsp;
          <a href={schemaUrl} target="_blank" rel="noopener noreferrer">
            {version}
          </a>
          &nbsp;-&nbsp;
          <a
            href={`${GITHUB_SCHEMA_DIR}/${eventAndVersionPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </li>
        {schemaExists && version <= latestVersion
          ? renderLatestVersion
          : renderNonExistingSchema}
      </ul>
    </ResultList>
  );
};
