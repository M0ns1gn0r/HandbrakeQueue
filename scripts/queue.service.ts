import { FileInfo, VideoSegment } from './file-info';

/** Represents a service that creates Handbrake Queues. */
export class QueueService {

    create(files: FileInfo[]): string {
        const filesXml =
            files.map(f => this.fileToXml(f)).reduce((prev, curr) => prev + curr, '');
        return this.surroundWithRoot(filesXml);
    }

    private surroundWithRoot(inner: string) {
        return `<?xml version="1.0"?>
<ArrayOfQueueTask
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">${inner}
</ArrayOfQueueTask>`;
    }

    private getVideoSegment(segment: VideoSegment) {
        if (!segment.firstSecond && !segment.lastSecond) {
            return `<PointToPointMode>Chapters</PointToPointMode>
                <StartPoint>1</StartPoint>
                <EndPoint>1</EndPoint>`;
        }
        return `<PointToPointMode>Seconds</PointToPointMode>
            <StartPoint>${segment.firstSecond || 0}</StartPoint>
            <EndPoint>${segment.lastSecond || 999999}</EndPoint>`;
    }

    private fileToXml(file: FileInfo) {
        const c = file.config;
        const targetPath = c.targetPath;
        const videoSegment = this.getVideoSegment(c.segment);
        const rotation = c.rotate === -90 ? 270 : c.rotate;

        // The schema corresponds to Handbrake 1.07.
        return `
    <QueueTask>
      <ScannedSourcePath>${file.path}</ScannedSourcePath>
      <Status>Waiting</Status>
      <Task>
        <Source>${file.path}</Source>
        <Title>1</Title>
        <Angle>1</Angle>
        ${videoSegment}
        <Destination>${targetPath}</Destination>
        <OutputFormat>Mp4</OutputFormat>
        <OptimizeMP4>true</OptimizeMP4>
        <IPod5GSupport>false</IPod5GSupport>
        <Width>1920</Width>
        <Height>1080</Height>
        <MaxWidth xsi:nil="true" />
        <MaxHeight xsi:nil="true" />
        <Cropping>
          <Top>0</Top>
          <Bottom>0</Bottom>
          <Left>0</Left>
          <Right>0</Right>
        </Cropping>
        <HasCropping>false</HasCropping>
        <Anamorphic>Automatic</Anamorphic>
        <DisplayWidth xsi:nil="true" />
        <KeepDisplayAspect>true</KeepDisplayAspect>
        <PixelAspectX>1</PixelAspectX>
        <PixelAspectY>1</PixelAspectY>
        <Modulus>2</Modulus>
        <DeinterlaceFilter>Decomb</DeinterlaceFilter>
        <Deinterlace>Default</Deinterlace>
        <CustomDeinterlace />
        <Decomb>Default</Decomb>
        <CombDetect>Default</CombDetect>
        <Detelecine>Off</Detelecine>
        <CustomDetelecine />
        <Denoise>Off</Denoise>
        <DenoisePreset>Light</DenoisePreset>
        <DenoiseTune>None</DenoiseTune>
        <CustomDenoise />
        <Deblock>4</Deblock>
        <Grayscale>false</Grayscale>
        <Rotation>${rotation}</Rotation>
        <FlipVideo>false</FlipVideo>
        <VideoEncodeRateType>AverageBitrate</VideoEncodeRateType>
        <VideoEncoder>X264</VideoEncoder>
        <FramerateMode>CFR</FramerateMode>
        <Quality>22</Quality>
        <VideoBitrate>2500</VideoBitrate>
        <TwoPass>true</TwoPass>
        <TurboFirstPass>false</TurboFirstPass>
        <Framerate xsi:nil="true" />
        <AudioTracks>
          <AudioTrack>
            <DRC>0</DRC>
            <Gain>0</Gain>
            <Encoder>AacPassthru</Encoder>
            <SampleRate>0</SampleRate>
            <EncoderRateType>Bitrate</EncoderRateType>
            <Bitrate>160</Bitrate>
            <Quality>-1</Quality>
            <IsDefault>false</IsDefault>
            <SampleRateDisplayValue>Auto</SampleRateDisplayValue>
            <ScannedTrack>
              <TrackNumber>1</TrackNumber>
              <Language>English</Language>
              <LanguageCode>eng</LanguageCode>
              <Description>English (AAC) (2.0 ch)</Description>
              <Codec>65536</Codec>
              <SampleRate>48000</SampleRate>
              <Bitrate>127579</Bitrate>
              <ChannelLayout>3</ChannelLayout>
            </ScannedTrack>
          </AudioTrack>
        </AudioTracks>
        <AllowedPassthruOptions>
          <AudioAllowAACPass>true</AudioAllowAACPass>
          <AudioAllowAC3Pass>true</AudioAllowAC3Pass>
          <AudioAllowDTSHDPass>true</AudioAllowDTSHDPass>
          <AudioAllowDTSPass>true</AudioAllowDTSPass>
          <AudioAllowMP3Pass>true</AudioAllowMP3Pass>
          <AudioAllowTrueHDPass>true</AudioAllowTrueHDPass>
          <AudioAllowFlacPass>true</AudioAllowFlacPass>
          <AudioAllowEAC3Pass>true</AudioAllowEAC3Pass>
          <AudioEncoderFallback>Ac3</AudioEncoderFallback>
        </AllowedPassthruOptions>
        <SubtitleTracks>
          <SubtitleTrack>
            <Burned>true</Burned>
            <Default>false</Default>
            <Forced>true</Forced>
            <SourceTrack>
              <SourceId>0</SourceId>
              <TrackNumber>0</TrackNumber>
              <Language>Foreign Audio Search (Bitmap)</Language>
              <SubtitleType>ForeignAudioSearch</SubtitleType>
            </SourceTrack>
            <SrtOffset>0</SrtOffset>
            <SubtitleType>VobSub</SubtitleType>
          </SubtitleTrack>
        </SubtitleTracks>
        <IncludeChapterMarkers>true</IncludeChapterMarkers>
        <ChapterNames>
          <ChapterMarker>
            <ChapterNumber>1</ChapterNumber>
            <Duration />
            <ChapterName>Chapter 1</ChapterName>
          </ChapterMarker>
        </ChapterNames>
        <AdvancedEncoderOptions />
        <VideoProfile>
          <DisplayName>High</DisplayName>
          <ShortName>high</ShortName>
        </VideoProfile>
        <VideoLevel>
          <DisplayName>4.1</DisplayName>
          <ShortName>4.1</ShortName>
        </VideoLevel>
        <VideoPreset>
          <DisplayName>VerySlow</DisplayName>
          <ShortName>veryslow</ShortName>
        </VideoPreset>
        <VideoTunes />
        ${rotation}
        <ShowAdvancedTab>false</ShowAdvancedTab>
        <MetaData />
        <IsPreviewEncode>false</IsPreviewEncode>
        <PreviewEncodeDuration xsi:nil="true" />
        <PreviewEncodeStartAt xsi:nil="true" />
      </Task>
      <Configuration>
        <IsDvdNavDisabled>false</IsDvdNavDisabled>
        <DisableQuickSyncDecoding>false</DisableQuickSyncDecoding>
        <UseQSVDecodeForNonQSVEnc>false</UseQSVDecodeForNonQSVEnc>
        <ScalingMode>Lanczos</ScalingMode>
        <PreviewScanCount>10</PreviewScanCount>
        <Verbosity>1</Verbosity>
        <MinScanDuration>10</MinScanDuration>
        <SaveLogToCopyDirectory>false</SaveLogToCopyDirectory>
        <SaveLogWithVideo>false</SaveLogWithVideo>
        <SaveLogCopyDirectory />
      </Configuration>
    </QueueTask>`;
    }
}