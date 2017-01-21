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

    private getRotation(rotate: number) {
        if (!rotate) {
            return "";
        }

        let rotateValue;
        if (rotate === 90) {
            rotateValue = 4;
        } else if (rotate === -90) {
            rotateValue = 7;
        } else {
            rotateValue = 3; // 180 degrees.
        }

        return `<ExtraAdvancedArguments>, --rotate=${rotateValue}</ExtraAdvancedArguments>`;
    }

    private fileToXml(file: FileInfo) {
        const c = file.config;
        const targetPath = c.targetPath;
        const videoSegment = this.getVideoSegment(c.segment);
        const rotation = this.getRotation(c.rotate);
        // TODO: take into account the selected preset.

        return `
    <QueueTask>
        <Status>Waiting</Status>
        <Task>
            <OptimizeMP4>true</OptimizeMP4>
            <IPod5GSupport>false</IPod5GSupport>
            <VideoBitrate>2500</VideoBitrate>
            <AudioTracks>
                <AudioTrack>
                    <Bitrate>128</Bitrate>
                    <DRC>0</DRC>
                    <IsDefault>false</IsDefault>
                    <Encoder>AacPassthru</Encoder>
                    <Gain>0</Gain>
                    <MixDown>DolbyProLogicII</MixDown>
                    <SampleRate>0</SampleRate>
                    <SampleRateDisplayValue>Auto</SampleRateDisplayValue>
                    <ScannedTrack>
                        <TrackNumber>1</TrackNumber>
                        <Language>English</Language>
                        <LanguageCode>eng</LanguageCode>
                        <Description>English (AAC) (2.0 ch)</Description>
                        <Format />
                        <SampleRate>48000</SampleRate>
                        <Bitrate>127498</Bitrate>
                    </ScannedTrack>
                    <TrackName />
                </AudioTrack>
            </AudioTracks>
            <AllowedPassthruOptions>
                <AudioAllowAACPass>true</AudioAllowAACPass>
                <AudioAllowAC3Pass>true</AudioAllowAC3Pass>
                <AudioAllowDTSHDPass>true</AudioAllowDTSHDPass>
                <AudioAllowDTSPass>true</AudioAllowDTSPass>
                <AudioAllowMP3Pass>true</AudioAllowMP3Pass>
                <AudioEncoderFallback>Ac3</AudioEncoderFallback>
            </AllowedPassthruOptions>
            <SubtitleTracks />
            <ChapterNames>
                <ChapterMarker>
                    <ChapterNumber>1</ChapterNumber>
                    <Duration />
                    <ChapterName>Chapter 1</ChapterName>
                </ChapterMarker>
            </ChapterNames>
            <Source>${file.path}</Source>
            <Title>1</Title>
            <Angle>1</Angle>
            ${videoSegment}
            <Destination>${targetPath}</Destination>
            <OutputFormat>Mp4</OutputFormat>
            <Width>1920</Width>
            <Height>0</Height>
            <MaxWidth xsi:nil="true" />
            <MaxHeight xsi:nil="true" />
            <Cropping>
                <Top>0</Top>
                <Bottom>0</Bottom>
                <Left>0</Left>
                <Right>0</Right>
            </Cropping>
            <HasCropping>false</HasCropping>
            <Anamorphic>Loose</Anamorphic>
            <DisplayWidth xsi:nil="true" />
            <KeepDisplayAspect>false</KeepDisplayAspect>
            <PixelAspectX>0</PixelAspectX>
            <PixelAspectY>0</PixelAspectY>
            <Modulus>2</Modulus>
            <Deinterlace>Off</Deinterlace>
            <Decomb>Default</Decomb>
            <Detelecine>Off</Detelecine>
            <Denoise>Off</Denoise>
            <DenoisePreset>Weak</DenoisePreset>
            <DenoiseTune>None</DenoiseTune>
            <Deblock>4</Deblock>
            <Grayscale>false</Grayscale>
            <VideoEncodeRateType>AverageBitrate</VideoEncodeRateType>
            <VideoEncoder>X264</VideoEncoder>
            <FramerateMode>CFR</FramerateMode>
            <Quality>20</Quality>
            <TwoPass>true</TwoPass>
            <TurboFirstPass>false</TurboFirstPass>
            <Framerate xsi:nil="true" />
            <IncludeChapterMarkers>true</IncludeChapterMarkers>
            <AdvancedEncoderOptions />
            <X264Preset>VerySlow</X264Preset>
            <QsvPreset>Balanced</QsvPreset>
            <H264Profile>High</H264Profile>
            <H264Level>4.1</H264Level>
            <X264Tune>None</X264Tune>
            <FastDecode>false</FastDecode>
            ${rotation}
            <X265Preset>VeryFast</X265Preset>
            <H265Profile>None</H265Profile>
            <X265Tune>None</X265Tune>
            <PreviewStartAt xsi:nil="true" />
            <PreviewDuration xsi:nil="true" />
            <IsPreviewEncode>false</IsPreviewEncode>
            <PreviewEncodeDuration>0</PreviewEncodeDuration>
            <ShowAdvancedTab>false</ShowAdvancedTab>
        </Task>
        <Configuration>
            <IsLoggingEnabled>true</IsLoggingEnabled>
            <IsDvdNavDisabled>false</IsDvdNavDisabled>
            <DisableQuickSyncDecoding>false</DisableQuickSyncDecoding>
            <EnableDxva>false</EnableDxva>
            <ScalingMode>Lanczos</ScalingMode>
            <PreviewScanCount>10</PreviewScanCount>
            <Verbosity>1</Verbosity>
            <MinScanDuration>10</MinScanDuration>
            <ProcessPriority>Below Normal</ProcessPriority>
            <SaveLogToCopyDirectory>false</SaveLogToCopyDirectory>
            <SaveLogWithVideo>false</SaveLogWithVideo>
            <SaveLogCopyDirectory />
        </Configuration>
    </QueueTask>`;
    }
}